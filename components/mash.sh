for i in `ls app-*.css`; do
  g=`echo $i | egrep -o \\\-\[^\\\.\]+ | egrep -o [^\\\-].+`;
  cat $i >> $g.html
done