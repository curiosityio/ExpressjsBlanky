require 'trent'

ci = Trent.new()

api_version = File.open('Versionfile') {|f| f.readline}
image_name = "docker-production-image-test"

# Build the image
ci.sh("docker build -f docker/app/Dockerfile-prod -t #{image_name} .")

# Test the newly built image
## First, startup the DB. We start it up separate because we need to sleep to allow it to create the schema and be ready before starting application. 
## I cannot use the /wait script that the dev and test images use because this is the built prod image. I want to not install the script there. 
ci.sh("docker network create external")
ci.sh('npm run db:production; sleep 10')
ci.sh("DOCKER_IMAGE_NAME=#{image_name} API_VERSION=#{api_version} npm run production:test; sleep 10")
ci.sh('docker logs app')
ci.sh('curl --fail --retry 10 --retry-delay 5 -v localhost:5000/version')