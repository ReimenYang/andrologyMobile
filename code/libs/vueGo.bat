@echo off
:menu
echo 1.启动当前vue项目
echo.
echo 2.编译当前vue项目并推送到test环境
echo.
echo 3.编译当前vue项目并推送到produce环境
echo.
echo 4.将当前项目编译文件推送到test环境
echo.
echo 5.将当前项目编译文件推送到produce环境
echo.
echo 6.退出
echo.
set all= 选择相应数字进入功能
set /p all=请输入（1，2，3，4，5，6）
if /i "%all%"=="1" yarn run serve
if /i "%all%"=="2" yarn run build & node ./node/toTest & pause
if /i "%all%"=="3" yarn run build & node ./node/toProduce & pause
if /i "%all%"=="4" node ./node/toTest & pause
if /i "%all%"=="5" node ./node/toProduce & pause
if /i "%all%"=="6" exit
:hide

:show
goto menu
:exit
exit