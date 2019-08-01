require 'trent'

ci = Trent.new() 

ci.sh("npm run test:setup")
ci.sh("npm run test")