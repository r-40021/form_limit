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

  for htmlDir in $htmlDirs;
  do
    fileName=`basename $htmlDir`
    newPath=./gas/${fileName}
    scp $htmlDir $newPath
    absJSPath=`echo ${jsDir} | sed 's/\.\/out//'`
    echo '<script src="'${absJSPath}'" defer=""></script>'
    sed 's|<script src="'${absJSPath}'" defer=""></script>|newScript|g' ${newPath} > temp.txt
    cat temp.txt > ${newPath}
  done
  rm temp.txt
done
