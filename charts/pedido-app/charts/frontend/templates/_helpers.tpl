{{- define "frontend.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-frontend" .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}