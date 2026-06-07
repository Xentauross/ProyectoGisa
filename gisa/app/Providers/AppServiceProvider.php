<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Carbon\Carbon;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (request()->isSecure() || str_contains(config('app.url'), 'https')) {
        URL::forceScheme('https');
    }

        Vite::prefetch(concurrency: 3);

        Carbon::macro('jsonSerialize', function () {
        return $this->toIso8601String(); // "2025-05-28T11:00:00+02:00"
        
    });
    }
}
