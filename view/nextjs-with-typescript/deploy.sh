#!/bin/sh
jsDirs=`find ./out -type f -and -name \*.js`
htmlDirs=`find ./out -type f -and -name \*.html`
cssDirs=`find ./out -type f -and -name \*.css`
mkdir -p gas

# HTML 書き換え

for htmlDir in $htmlDirs;
do
  fileName=`basename $htmlDir`
  newPath=./gas/${fileName}
  scp $htmlDir $newPath
  # JavaScript
  for jsDir in $jsDirs;
  do
    absJSPath=`echo ${jsDir} | sed 's/\.\/out//'`
    JSFileName=`basename $jsDir`
    JSOnlyFileName=`echo ${JSFileName} | sed 's/.js//'`
    sed -i 's|<script src="'${absJSPath}'" defer=""></script>|<?!= HtmlService.createHtmlOutputFromFile('\'$JSOnlyFileName\'').getContent(); ?>|g' ${newPath}
    sed -i 's|<script defer="" nomodule="" src="'${absJSPath}'"></script>|<?!= HtmlService.createHtmlOutputFromFile('\'$JSOnlyFileName\'').getContent(); ?>|g' ${newPath}
  done

  # CSS
  for cssDir in $cssDirs;
  do
    cssContent=`cat ${cssDir}`
    addCSSContent="<style>${cssContent}</style>"
    absCSSPath=`echo ${cssDir} | sed 's/\.\/out//'`
    sed -i 's|<link rel="preload" href="'${absCSSPath}'" as="style"/>|'${addCSSContent}'|g' ${newPath}
    sed -i 's|<link rel="stylesheet" href="'${absCSSPath}'" data-n-p=""/>|'${addCSSContent}'|g' ${newPath}
  done

done
