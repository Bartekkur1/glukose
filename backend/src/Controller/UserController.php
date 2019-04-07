<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use App\Responses\Responses;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserController extends AbstractController
{
    /**
     * @Route("/register", name="user_register")
     */
    public function register(Request $request, ValidatorInterface $validator, UserPasswordEncoderInterface $encoder)
    {
        $data = json_decode($request->getContent(), true);
        $entityManager = $this->getDoctrine()->getManager();
        $users = $entityManager->getRepository(User::class);

        if($data["password"] != $data["confirmPassword"])
            return Responses::BadRequest("Hasła muszą być takie same!");

        $user = new User();
        $user->setUsername($data["username"]);
        $user->setPassword($encoder->encodePassword($user, $data["password"]));
        $user->setEmail($data["email"]);
        $user->setToken("");

        $errors = $validator->validate($user);
        if(count($errors) > 0) 
            return Responses::BadRequest(["error" => $errors[0]->getMessage(), "name" => $errors[0]->getPropertyPath()]);  

        if($usedLogin = $users->findOneBy(["username" => $data["username"]]))
            return Responses::BadRequest(["error" => "Nazwa użytkownika jest już zajęta"]);

        if($usedEmail = $users->findOneBy(["email" => $data["email"]]))
            return Responses::BadRequest(["error" => "Adres email jest już zajęty"]);

        $entityManager->persist($user);
        $entityManager->flush();
        return Responses::Ok();
    }
}
