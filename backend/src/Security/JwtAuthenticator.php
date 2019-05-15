<?php

namespace App\Security;

use App\Entity\User;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use App\Service\JwtService;

class JwtAuthenticator extends AbstractGuardAuthenticator
{

    private $jwtService;

    public function __construct(JwtService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    public function supports(Request $request)
    {
        return $request->headers->get("Authorization");
    }

    public function getCredentials(Request $request)
    {
        $bearer = $request->headers->get("Authorization");
        return explode(" ", $bearer)[1];
    }

    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        $username = $this->jwtService->decodeJwt($credentials);
        $user = $userProvider->loadUserByUsername($username);

        if (!$user)
            return new JsonResponse(["error" => "Użytkownik nie istnieje"], Response::HTTP_BAD_REQUEST);
            
        return $user;
    }

    public function checkCredentials($jwt, UserInterface $user)
    {
        return $user->getToken() === $jwt;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        // $this->jwtService->userSetJwt($token->getUser());
        // return new RedirectResponse("/admin");
        return;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        return new JsonResponse(["error" => "Podany token nie jest poprawny"], Response::HTTP_FORBIDDEN);
    }

    public function start(Request $request, AuthenticationException $authException = null)
    {
        return new JsonResponse(["error" => "Wymagane zalogowanie"], Response::HTTP_UNAUTHORIZED);
    }

    public function supportsRememberMe()
    {
        return false;
    }
}