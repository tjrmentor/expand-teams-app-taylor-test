import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { App } from "octokit";

const WEBHOOK_TOKEN_SECRET_NAME = "/github/expand-teams-taylor-test/webhook-secret";
const PRIVATE_KEY_SECRET_NAME = "/github/expand-teams-taylor-test/private-key";

const awsSecrets = await getAWSSecrets(
    WEBHOOK_TOKEN_SECRET_NAME,
    PRIVATE_KEY_SECRET_NAME);

const APP_ID = 411539;

const app = new App({
    appId: APP_ID,
    privateKey: awsSecrets.privateKey,
    webhooks: { secret: awsSecrets.webhookSecret }
});

app.webhooks.on(["pull_request.review_requested"], async ({ octokit, payload }) => {
    if (payload["requested_reviewer"]) {
        console.log("An individual reviewer was requested, do nothing.")
    } else if (payload["requested_team"]) {
        console.log("A team reviewer was requested, expand the team.")
        const iterator = octokit.paginate.iterator(octokit.rest.teams.listMembersInOrg, {
            org: payload.organization.login,
            team_slug: payload["requested_team"].slug
        });

        const teamMembers = [];

        for await (const {data: members} of iterator) {
            for (const member of members) {
                if (member.login == payload.pull_request.user.login) {
                    console.log(`Skipping ${member.login}, can't request review from PR author`);
                } else {
                    console.log(`Adding ${member.login} to list of users to request reviews from`);
                    teamMembers.push(member.login);
                }
            }
        }

        console.log(`owner: ${payload.pull_request.head.repo.owner.login}`);
        console.log(`repo: ${payload.pull_request.head.repo.name}`);
        console.log(`pull_number: ${payload.pull_request.number}`);
        console.log(`reviewers: ${teamMembers}`);
        const response = await octokit.rest.pulls.requestReviewers({
            owner: payload.pull_request.head.repo.owner.login,
            repo: payload.pull_request.head.repo.name,
            pull_number: payload.pull_request.number,
            reviewers: teamMembers
        });

        console.log(response);
    }
});

export const handler = async (event) => {
    await app.webhooks.verifyAndReceive({
        id: event.headers["x-github-delivery"],
        name: event.headers["x-github-event"],
        signature: event.headers["x-hub-signature-256"],
        payload: event.body
    });
}

async function getAWSSecrets(
    webhookSecretName,
    privateKeySecretName) {
    const client = new SecretsManagerClient({
        region: "us-east-1",
    });

    let webhookSecretResponse, privateKeyResponse;

    try {
        webhookSecretResponse = await client.send(
            new GetSecretValueCommand({
                SecretId: webhookSecretName,
                VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
            })
        );

        privateKeyResponse = await client.send(
            new GetSecretValueCommand({
                SecretId: privateKeySecretName,
                VersionStage: "AWSCURRENT",
            })
        );
    } catch (error) {
        // For a list of exceptions thrown, see
        // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        throw error;
    }

    return {
        webhookSecret: webhookSecretResponse.SecretString,
        privateKey: privateKeyResponse.SecretString
    }
}