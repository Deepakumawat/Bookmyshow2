#!/bin/bash
# BookMyShow — Kubernetes Deploy Script
# Run: bash k8s/deploy.sh

echo "========================================"
echo "  BookMyShow Kubernetes Deployment"
echo "========================================"

# Step 1 — Create namespace
echo "[1/5] Creating namespace..."
kubectl apply -f k8s/namespace.yaml

# Step 2 — Create secrets
echo "[2/5] Applying secrets..."
kubectl apply -f k8s/secret.yaml

# Step 3 — Deploy app
echo "[3/5] Deploying application (2 replicas)..."
kubectl apply -f k8s/deployment.yaml

# Step 4 — Create service
echo "[4/5] Creating service..."
kubectl apply -f k8s/service.yaml

# Step 5 — Auto-scaler
echo "[5/5] Setting up auto-scaler (2-10 pods)..."
kubectl apply -f k8s/hpa.yaml

echo ""
echo "========================================"
echo "  Deployment complete!"
echo "========================================"
echo ""

# Show status
echo "Pods:"
kubectl get pods -n bookmyshow

echo ""
echo "Service:"
kubectl get service -n bookmyshow

echo ""
echo "Auto-scaler:"
kubectl get hpa -n bookmyshow
