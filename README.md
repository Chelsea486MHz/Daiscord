![dAIscord logo](logo.png)

# Interact with your Discord users with custom AI endpoints

dAIscord allows you to add custom AI bots to your server.

Their AI can be customized from OpenAI's GPT4 to custom models using Dalai.

# Usage with Mobula

[Mobula](https://github.com/Chelsea486MHz/mobula) is a Python Flask wrapper for [Dalai](https://github.com/cocktailpeanut/dalai) that allows running it as a web service and provides token-based authentication.

You can now use Docker Compose to orchestrate multiple bots for your server and easily deploy them:

`$ cat ./docker-compose.yml`

```
version: '3'

services:
  macron:
    build:
      context: .
    restart: unless-stopped
    environment:
      - DISCORD_TOKEN=your-discord-token
      - AI_TOKEN=your-mobula-token
      - AI_URI=http://localhost:8000/completion
      - PREPROMPT=Hi
```

Simply run the following command:

`$ docker compose up -d`

The bot should go online and answer user messages.

# Technical details

Built using [Node.JS](https://nodejs.org/en).

The Docker image is based on [Alpine Linux](https://www.alpinelinux.org/)