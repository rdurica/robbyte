<?php

use App\Kernel;
use Symfony\Component\HttpFoundation\Request;

require_once dirname(__DIR__).'/vendor/autoload_runtime.php';

return function (array $context) {
    if ($trustedProxies = $_SERVER['TRUSTED_PROXIES'] ?? $_ENV['TRUSTED_PROXIES'] ?? false) {
        $proxies = array_filter(array_map('trim', explode(',', $trustedProxies)));
        Request::setTrustedProxies($proxies, Request::HEADER_X_FORWARDED_FOR | Request::HEADER_X_FORWARDED_HOST | Request::HEADER_X_FORWARDED_PORT | Request::HEADER_X_FORWARDED_PROTO);
    }

    if ($trustedHosts = $_SERVER['TRUSTED_HOSTS'] ?? $_ENV['TRUSTED_HOSTS'] ?? false) {
        $hosts = array_filter(array_map('trim', explode(',', $trustedHosts)));
        Request::setTrustedHosts($hosts);
    }

    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
