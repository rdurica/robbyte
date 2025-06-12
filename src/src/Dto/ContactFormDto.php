<?php declare(strict_types=1);

namespace App\Dto;


/**
 * ContactFormDto.
 *
 * @copyright Copyright (c) 2025, Robert Durica
 * @since     2025-06-12
 */
final class ContactFormDto
{
    public string $name;

    public string $email;

    public string $subject;

    public string $message;
}
