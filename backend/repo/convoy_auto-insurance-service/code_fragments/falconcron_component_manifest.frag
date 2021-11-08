  - name: {{JOBNAME_HYPHENATED}}
    type: cronjob
    deployment_zones:
      - bulk
    helm_chart_default_values_files:
      - default/profiles/{{JOBNAME_HYPHENATED}}.yml
    helm_chart_production_overrides_values_files:
      - overrides/profiles/{{JOBNAME_HYPHENATED}}-production-overrides.yml

