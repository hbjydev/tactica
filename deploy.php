<?php

namespace Deployer;

require 'recipe/laravel.php';

// Config

set('repository', 'https://github.com/hbjydev/tactica.git');
set('http_user', 'www-data');

add('shared_files', []);
add('shared_dirs', []);
add('writable_dirs', []);

// Hosts

host('178.105.32.44')
    ->set('remote_user', 'deployer')
    ->set('deploy_path', '~/tactica');

// Hooks

after('deploy:failed', 'deploy:unlock');
