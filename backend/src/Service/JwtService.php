<?php

namespace App\Service;

use \Firebase\JWT\JWT;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class JwtService 
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function userSetJwt(User $user)
    {
        $jwt = $this->getJwt($user);
        $user->setToken($jwt);
        $this->em->persist($user);
        $this->em->flush();
        return $jwt;
    }

    public function userCheckJwt($jwt, $username)
    {
        $userRepo = $this->em->getRepository(User::class);
        $user = $userRepo->findOneBy(["username" => $username]);
        if($user)
            return $user->getToken() === $jwt;
        return false;
    }

    public function decodeJwt($jwt)
    {
        try {
            $decoded = JWT::decode($jwt, $_ENV["JWT_KEY"], array('HS256'));
            $user = new User();
            $user->unserialize($decoded->user);
            return $user->getUsername();
        } catch (\Throwable $th) {
            return null;
        }
    }

    public function getJwt($user)
    {
        return JWT::encode([
            "user" => $user->serialize(),
            "loginTime" => time(),
            // "exp" => time() + 30 * 60,
        ], $_ENV["JWT_KEY"]);
    }

}