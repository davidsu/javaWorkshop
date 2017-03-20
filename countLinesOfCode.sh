#/bin/sh
find . | egrep -v 'target|resources|node_modules|idea|\.git|DS_Store|./javaWorkshopProject.iml' | xargs wc -l
