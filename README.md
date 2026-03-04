
  # DIMA

  This is a code bundle for DIMA. The original project is available at https://www.figma.com/design/du6QKyiDVSJyz5ZXcz8RVk/DIMA.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
---

## Deployment

### Quick Start
- **Staging Deployment:** Follow [STAGING_DEPLOYMENT_CHECKLIST.md](STAGING_DEPLOYMENT_CHECKLIST.md)
- **Go Live:** Follow [GO_LIVE_PLAN.md](GO_LIVE_PLAN.md)
- **Emergency Rollback:** Follow [ROLLBACK_PLAN.md](ROLLBACK_PLAN.md)
- **Quick Reference:** See [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

### Build Commands
```bash
# Build for staging (/staging/ subdirectory)
npm run build -- --base=/staging/

# Build for production (root /)
npm run build
```

### Deployment Strategy
The site uses a **staged deployment approach**:
1. **Test in staging** at `https://yourdomain.com/staging/`
2. **Go live** at `https://yourdomain.com/` (with rollback option)
3. **Keep staging** available as reference/fallback

See [DEPLOYMENT_STRATEGY_SUMMARY.md](DEPLOYMENT_STRATEGY_SUMMARY.md) for full details.  