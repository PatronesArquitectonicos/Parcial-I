{{- define "backend.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-backend" .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}