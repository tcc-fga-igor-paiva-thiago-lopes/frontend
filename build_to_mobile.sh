# $1 => Environment

[ -z "$1" ] && environment='development' || environment="$1"

ionic build -- --mode $environment && ionic cap sync -- --mode $environment