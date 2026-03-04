#!/bin/bash
# Build scripts for DIMA - use these commands to build for staging or production

echo "DIMA Build Scripts"
echo "=================="
echo ""
echo "For Staging Deployment:"
echo "  npm run build -- --base=/staging/"
echo ""
echo "For Production Deployment:"
echo "  npm run build"
echo ""
echo "Or use the environment variables:"
echo "  VITE_BASE_PATH=/staging/ npm run build"
echo "  VITE_BASE_PATH=/ npm run build"
