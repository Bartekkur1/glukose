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
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use App\Service\JwtService;

class UserAuthenticator extends AbstractGuardAuthenticator
{

    private $encoder;
    private $jwtService;

    public function __construct(UserPasswordEncoderInterface $encoder, JwtService $jwtService)
    {
        $this->encoder = $encoder;
        $this->jwtService = $jwtService;
    }

    public function supports(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        return $request->isMethod('POST') && isset($data["username"]) && isset($data["password"]) && $request->getPathInfo() == "/api/auth/login";
    }

    public function getCredentials(Request $request)
    {
        return json_decode($request->getContent(), true);
        // $data = json_decode($request->getContent(), true);
        // return [
        //     'username' => $data["username"],
        //     'password' => $data["password"],
        // ];
    }

    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        $username = $credentials["username"];
        $password = $credentials["password"];
        $user = $userProvider->loadUserByUsername($username);

        if (!$user)
            return new JsonResponse(["error" => "Użytkownik nie istnieje"], Response::HTTP_BAD_REQUEST);
            
        return $user;
    }

    public function checkCredentials($credentials, UserInterface $user)
    {
        $password = $credentials['password'];
        return $this->encoder->isPasswordValid($user, $password);
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        $jwt = $this->jwtService->userSetJwt($token->getUser());
        // return new RedirectResponse("/admin");
        // return;
        return new JsonResponse(["token" => $jwt], Response::HTTP_OK);
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        return new JsonResponse(["error" => "Zły login lub hasło"], Response::HTTP_FORBIDDEN);
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