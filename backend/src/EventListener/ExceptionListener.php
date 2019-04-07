<?php


namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use App\Controller\TokenAuthenticatedController;
use App\Responses\Responses;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use \Firebase\JWT\JWT;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;

class ExceptionListener
{
    protected $entityManager;

    function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function onKernelException(GetResponseForExceptionEvent $event)
    {
        if($event->getException() instanceof NotFoundHttpException)
            $event->setResponse(Responses::NotFound());
        else if($event->getException() instanceof UnauthorizedHttpException)
            $event->setResponse(Responses::PermisionDenied());
        else if($event->getException() instanceof MethodNotAllowedHttpException)
            $event->setResponse(Responses::NotFound());
        else if($event->getException() instanceof BadRequestHttpException)
            $event->setResponse(Responses::BadRequest());
    }

    public function onKernelController(FilterControllerEvent $event)
    {
        $safePaths = [
            "/auth/login",
            "/auth/check",
            "/register",
            "/user/recover_password"
        ];

        $controller = $event->getController();
        if ($controller[0] instanceof TokenAuthenticatedController &&
            !in_array($event->getRequest()->getPathInfo(), $safePaths) ) {
            $token = $event->getRequest()->headers->get("Authorization");
            if(!$token)
                throw new UnauthorizedHttpException("");
            $token = explode(" ", $token)[1];
            $users = $this->entityManager->getRepository(User::class);
            try 
            {
                $decoded = JWT::decode($token, $_ENV["JWT_KEY"], array('HS256'))[0];
                $user = new User();
                $user->unserialize($decoded->user);
                if($user = $users->findOneBy(["id" => $user->getId()]))
                {
                    if($user->getToken() == $token)
                    {
                        $event->getRequest()->request->set("user", $decoded->user);
                        return;
                    }
                    throw new UnauthorizedHttpException("");
                }
                throw new UnauthorizedHttpException("");
            }
            catch(\Firebase\JWT\SignatureInvalidException $e)
            {
                throw new UnauthorizedHttpException("");
            }
            catch(\Firebase\JWT\ExpiredException $e)
            {
                throw new UnauthorizedHttpException("");
            }
        }
    }
}