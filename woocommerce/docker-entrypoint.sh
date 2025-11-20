#!/bin/bash
set -e

# Executar entrypoint padrão do WordPress
exec docker-entrypoint.sh "$@"
