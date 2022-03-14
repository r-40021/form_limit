#!/bin/sh
jsDirs=`find ./out/_next -type f -and -name \*.js`
htmlDirs=`find ./out -type f -and -name \*.html`
mkdir -p gas

for jsDir in $jsDirs;
do
  fileName=`basename $jsDir`
  newPath=./gas/${fileName}.html
  scp $jsDir $newPath
  sed -i -e "1s/^/<script>/" ${newPath}
  sed -i "\$a </script>" ${newPath}
  echo ${jsDir}

  for htmlDir in $htmlDirs;
  do
    fileName=`basename $htmlDir`
    newPath=./gas/${fileName}
    scp $htmlDir $newPath
    relativeJSPath=`sed -e 's/./' ${jsDir}`
    sed -i -e 's/\<script src="${relativeJSPath}" defer=""\>\<\/script\>/いれかえ/' ${newPath}
  done
done
