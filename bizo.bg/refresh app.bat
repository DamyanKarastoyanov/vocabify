call composer install
call composer dump-autoload -o
call php artisan migrate
call php artisan optimize
call php artisan cache:clear
call php artisan config:clear
call php artisan route:clear
call php artisan view:clear
call php artisan event:clear
