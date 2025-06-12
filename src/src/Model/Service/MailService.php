<?php declare(strict_types=1);

namespace App\Model\Service;

use App\Dto\ContactFormDto;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

/**
 * MailService.
 *
 * @copyright Copyright (c) 2025, Robert Durica
 * @since     2025-06-12
 */
final class MailService
{
    public function __construct(private readonly MailerInterface $mailer)
    {
    }

    /**
     * @param ContactFormDto $contactFormDto
     *
     * @return void
     * @throws TransportExceptionInterface
     */
    public function send(ContactFormDto $contactFormDto): void
    {
        $subject = sprintf('New email from %s', $contactFormDto->email);

        $email = (new TemplatedEmail())
            ->from(new Address('info@robbyte.net'))
            ->to('r.durica@gmail.com')
            ->subject($subject)
            ->htmlTemplate('email/contact.html.twig')
            ->context([
                'contact' => $contactFormDto,
            ]);

        $this->mailer->send($email);
    }
}
