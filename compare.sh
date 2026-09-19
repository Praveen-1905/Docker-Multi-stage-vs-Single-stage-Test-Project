#!/usr/bin/env bash
# compare.sh
# Builds both images, prints their sizes side by side, then runs each
# briefly so you can curl them and confirm both actually work.

set -e

echo "=== Building MULTI-STAGE image ==="
docker build -f Dockerfile.multistage -t demo-multistage:latest .

echo ""
echo "=== Building SINGLE-STAGE image ==="
docker build -f Dockerfile.singlestage -t demo-singlestage:latest .

echo ""
echo "=== IMAGE SIZE COMPARISON ==="
docker images | head -n 1
docker images | grep -E "demo-multistage|demo-singlestage"

echo ""
echo "=== Running multi-stage container on :8081 ==="
docker run -d --rm --name demo-multi -p 8081:8080 demo-multistage:latest
sleep 1
curl -s http://localhost:8081/healthz && echo " <- multi-stage healthz OK"

echo ""
echo "=== Running single-stage container on :8082 ==="
docker run -d --rm --name demo-single -p 8082:8080 demo-singlestage:latest
sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8082 && echo "<- single-stage HTTP status"

echo ""
echo "Visit:"
echo "  http://localhost:8081  (multi-stage / nginx)"
echo "  http://localhost:8082  (single-stage / node serve)"
echo ""
echo "When done, clean up with:"
echo "  docker stop demo-multi demo-single"
