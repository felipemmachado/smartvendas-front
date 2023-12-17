#!/bin/sh

ROOT_DIR=/usr/share/nginx/html

# Replace env vars in JavaScript files
echo "Replacing env constants in JS"
for file in $ROOT_DIR/js/*.js* $ROOT_DIR/index.html;
do
  echo "Processing $file ...";

  sed -i 's|__VUE_APP_API__|'${VUE_APP_API}'|g' $file 

done

echo "Starting Nginx"
nginx -g 'daemon off;'