<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\JsonResponse;

class AuthController extends AbstractController implements AuthenticationEntryPointInterface
{
    /**
     * @Route("/api/auth/login", name="app_login")
     */
    public function start(Request $request, AuthenticationException $authException = null)
    {
        return new Response("", 400);
    }

    /**
     * @Route("/api/auth/logout", name="app_logout")
     */
    public function logout()
    {
        return new Response();
    }

    /**
     * @Route("/api/auth/check", name="app_check")
     */
    public function check()
    {
        $this->denyAccessUnlessGranted("ROLE_ADMIN");
        $user = $this->getUser();
        return new JsonResponse([
            "username" => $user->getUsername(),
            "email" => $user->getEmail()
        ]);
    }
}