# NapoleonIT test task for mobile school

## Run local

To run local:
```bash
npm start
```

## Docker

### Build:

```bash
docker build --tag nap-task .
```

### Test

```bash
docker run nap-task test
```

### Start

```bash
docker run -p 8080:8080 nap-task start
```

### docker-compose

You can use docker-compose
