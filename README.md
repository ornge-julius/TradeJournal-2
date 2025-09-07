# TradeJournal-2

This repository contains a React-based trading journal application.

## Docker usage

Build the container image:

```bash
docker build -t tradejournal-app .
```

Run the application locally:

```bash
docker run -p 3000:80 tradejournal-app
```

Or use Docker Compose:

```bash
docker compose up --build
```

The app will be available at <http://localhost:8080>.

## Kubernetes deployment

A sample deployment is provided under `k8s/deployment.yaml`.
After pushing your container image to a registry, deploy it with:

```bash
kubectl apply -f k8s/deployment.yaml
```

The service exposes the app on port 80 within the cluster.
