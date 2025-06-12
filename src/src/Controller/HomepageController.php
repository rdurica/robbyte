<?php declare(strict_types=1);

namespace App\Controller;

use App\Form\ContactFormType;
use App\Model\Facade\MailFacade;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Routing\Attribute\Route;

final class HomepageController extends AbstractController
{
    public function __construct(private readonly MailFacade $mailFacade)
    {
    }

    #[Route('/', name: 'app_homepage')]
    public function index(Request $request): Response
    {
        $form = $this->createForm(ContactFormType::class);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid())
        {
            return $this->handleContactForm($form);
        }

        return $this->render('homepage/index.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * Handle send email after successfull form send.
     *
     * @param FormInterface $form
     *
     * @return RedirectResponse
     */
    private function handleContactForm(FormInterface $form): RedirectResponse
    {
        try
        {
            $contactFormDto = $form->getData();
            $this->mailFacade->send($contactFormDto);

            $this->addFlash('success', 'Message was successfully sent!');
        }
        catch (TransportExceptionInterface|Exception)
        {
            $this->addFlash('error', 'Oops. Message cannot be sent. Please try again later or contact me directly.');
        }

        return $this->redirectToRoute('app_homepage');
    }
}
