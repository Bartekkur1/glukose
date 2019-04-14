<?php

namespace App\Controller;

use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoder;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Routing\Annotation\Route;
use App\Responses\Responses;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use \Firebase\JWT\JWT;
use App\Entity\User;
use App\Controller\TokenAuthenticatedController;

class AuthController extends AbstractController implements TokenAuthenticatedController
{

    /**
     * @Route("/auth/logout", name="auth_logout")
     */
    public function logout(Request $request)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $token = explode(" ", $request->headers->get("Authorization"))[1];
        if(!$token)
            throw new UnauthorizedHttpException("");
        $users = $entityManager->getRepository(User::class);
        $decoded = JWT::decode($token, $_ENV["JWT_KEY"], array('HS256'))[0];
        $user = new User();
        $user->unserialize($decoded->user);
        $foundUser = $users->findOneBy(["id" => $user->getId()]);
        $foundUser->setToken("");
        $entityManager->persist($foundUser);
        $entityManager->flush();
        return Responses::Ok();
    }

    /**
     * @Route("/auth/login", name="auth_login")
     */
    public function login(Request $request, ValidatorInterface $validator, UserPasswordEncoderInterface $encoder)
    {
        $data = json_decode($request->getContent(), true);
        $user = new User();
        isset($data["username"]) ? $user->setUsername($data["username"]) : "";
        isset($data["password"]) ? $user->setPassword($data["password"]) : "";

        $errors = $validator->validate($user);
        if(count($errors) > 0) 
            return Responses::BadRequest(["error" => $errors[0]->getMessage(), "name" => $errors[0]->getPropertyPath()]);  

        $entityManager = $this->getDoctrine()->getManager();
        $users = $entityManager->getRepository(User::class);
        $foundUser = $users->findOneBy(["username" => $user->getUsername()]);

        if(!$foundUser)
            return Responses::BadRequest(["error" => "Zły login lub hasło"]);

        if(!$encoder->isPasswordValid($foundUser, $data["password"]))
            return Responses::BadRequest(["error" => "Zły login lub hasło"]);

        $token = JWT::encode(array([
            "user" => $foundUser->serialize(),
            "loginTime" => time(),
            // "exp" => time() + 30 * 60,
        ]), $_ENV["JWT_KEY"]);
        $foundUser->setToken($token);
        $entityManager->persist($foundUser);
        $entityManager->flush();
        return new JsonResponse(["token" => $token]);
    }

    /**
     * @Route("/auth/check", name="auth_check")
     */
    public function check(Request $request)
    {
        if(!$token = $request->headers->get("Authorization")) 
            throw new UnauthorizedHttpException("");

        $token = explode(" ", $token)[1];
        try 
        {
            $decoded = JWT::decode($token, $_ENV["JWT_KEY"], array('HS256'))[0];
            $users = $this->getDoctrine()->getManager()->getRepository(User::class);     
            $user = new User();
            $user->unserialize($decoded->user);
            $user_id = $user->getId();

            if(!$user = $users->findOneBy(["id" => $user_id]))
                throw new UnauthorizedHttpException("");

            if($user->getToken() != $token)
                throw new UnauthorizedHttpException("");

            return $this->json(array([
                "username" => $user->getUsername(),
                "email" => $user->getEmail(),
            ])[0], 200);
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