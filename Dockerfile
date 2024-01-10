FROM public.ecr.aws/lambda/nodejs:18

COPY dist/index.js package.json package-lock.json ${LAMBDA_TASK_ROOT}

RUN npm install
  
CMD [ "index.handler" ]