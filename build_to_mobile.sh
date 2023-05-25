# $1 => Environment
# $2 => Platform

[ -z "$1" ] && environment='development' || environment="$1"

[ -z "$2" ] && platform='android' || platform="$2"

if [ "$environment" = "production" ]; then
    ionic build -- --prod --mode $environment --platform $platform && ionic capacitor build $platform --no-build --prod
else
    ionic build -- --mode $environment --platform $platform && ionic capacitor build $platform --no-build
fi
