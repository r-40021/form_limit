#!/bin/sh
jsDirs=`find ./out/_next -type f -and -name \*.js`
mkdir -p gas

for dir in $jsDirs;
do
  echo $dir
  fileName=`basename $dir`
  newPath=./gas/${fileName}.html
  scp $dir $newPath
  sed -i -e "1s/^/<script>/" ${newPath}
  sed -i "\$a </script>" ${newPath}
done


# ここからHTMLの処理
htmlDirs=`find ./out -type f -and -name \*.html`

for dir in $htmlDirs;
do
  echo $dir
  fileName=`basename $dir`
  newPath=./gas/${fileName}
  scp $dir $newPath
  sed -i "\s/src=\"/_next/static//src=\".//g" ${newPath}
done