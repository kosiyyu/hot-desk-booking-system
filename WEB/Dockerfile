FROM oven/bun:1

WORKDIR /app

COPY WEB/package*.json ./

RUN bun install

COPY WEB .

EXPOSE 5173

CMD ["bun", "run", "dev", "--host", "0.0.0.0"]