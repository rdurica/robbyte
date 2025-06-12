<?php declare(strict_types=1);

namespace App\Model\Facade;

use App\Dto\ContactFormDto;
use App\Model\Service\MailService;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

/**
 * MailFacade.
 *
 * @copyright Copyright (c) 2025, Robert Durica
 * @since     2025-06-12
 */
final class MailFacade
{
    public function __construct(private readonly MailService $mailService)
    {
    }

    /**
     * @throws TransportExceptionInterface
     */
    public function send(ContactFormDto $contactFormDto): void
    {
        $this->mailService->send($contactFormDto);
    }
}
