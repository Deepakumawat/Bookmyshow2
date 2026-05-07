#!/bin/bash
# Rollback to previous version if something goes wrong
# Run: bash k8s/rollback.sh

echo "Rolling back BookMyShow to previous version..."
kubectl rollout undo deployment/bookmyshow-app -n bookmyshow
kubectl rollout status deployment/bookmyshow-app -n bookmyshow
echo "Rollback complete!"
kubectl get pods -n bookmyshow
