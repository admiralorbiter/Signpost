# VR Levels Organization

This directory contains all VR levels organized by category for the Signpost Observatory.

## Folder Structure

- **education/** - Education-focused VR experiences
  - Interactive learning environments
  - AI tutoring simulations
  - Classroom experiences
  - Educational data visualizations

- **democracy/** - Democracy and political analysis
  - Democratic process simulations
  - Political data visualizations
  - Civic engagement tools
  - Constitutional analysis

- **connection/** - Human connection and AI philosophy
  - Empathy training experiences
  - Virtual therapy environments
  - Philosophical contemplation spaces
  - Social VR experiences

- **analysis/** - Data visualization and analytics
  - 3D data visualization spaces
  - Crime mapping interfaces
  - Urban planning tools
  - Real-time analytics dashboards

- **philosophy/** - Critical thinking and philosophy
  - Bias detection exercises
  - Logical fallacy demonstrations
  - Philosophical paradox experiences
  - Cognitive training tools

## Adding New Levels

1. Choose the appropriate category folder
2. Create your HTML file with a descriptive name
3. Update the portal configuration in `portal_config.py`
4. Test the level through the main gateway

## Naming Convention

Use kebab-case for level files:
- `classroom-time-machine.html`
- `gerrymandering-playground.html`
- `empathy-engine.html`

## Development Guidelines

- Each level should be self-contained
- Use shared components from `/shared/` when possible
- Follow the established UI/UX patterns
- Include proper accessibility features
- Test in both desktop and VR modes 