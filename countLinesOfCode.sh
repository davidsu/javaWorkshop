#/bin/sh
find . -type f | egrep -v 'target|resources|node_modules|idea|\.git|DS_Store|./javaWorkshopProject.iml|./javaWorkshopLog.txt|./Session.vim' | xargs wc -l
