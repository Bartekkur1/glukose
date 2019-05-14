<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use App\Responses\Responses;
use App\Entity\User;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserService
{
    private $em;
    private $encoder;
    private $validator;

    public function __construct(EntityManagerInterface $em, ValidatorInterface $validator, UserPasswordEncoderInterface $encoder)
    {
        $this->em = $em;
        $this->encoder = $encoder;
        $this->validator = $validator;
    }

    public function createUser($data)
    {
        $data = json_decode($data, true);
        if($data["password"] != $data["confirmPassword"])
            return Responses::BadRequest("Hasła muszą być takie same!");
        
        $user = User::fromRegisterForm($data);
        $user->setPassword($this->encoder->encodePassword($user, $data["password"]));

        $errors = $this->validateUser($user);
        if(count($errors) > 0)
            throw new BadRequestHttpException($errors[0]->getMessage());

        if(!$this->isUsernameFree($data["username"]))
            throw new BadRequestHttpException("Nazwa użytkownika jest już zajęta");
        if(!$this->isUserEmailFree($data["email"]))
            throw new BadRequestHttpException("Adres email jest już zajęty");


        $this->em->persist($user);
        $this->em->flush();
        return $user->getId();
    }

    public function getUserFromSerialized($serialized)
    {
        $unserialized = new User();
        $unserialized->unserialize($serialized);
        $userRepo = $this->em->getRepository(User::class);
        if(!$user = $userRepo->findOneBy(["username" => $unserialized->getUsername()]))
            return null;
        if(!$this->encoder->isPasswordValid($user, $unserialized->getPassword()))
            return null;
        return $user;
    }

    public function removeUser($user)
    {
        $this->em->remove($user);
        $this->em->flush();
    }

    public function validateUser($user)
    {
        return $errors = $this->validator->validate($user);
    }

    public function isUserEmailFree($email)
    {
        $userRepo = $this->em->getRepository(User::class);
        if($emailFound = $userRepo->findOneBy(["email" => $email]))
            return false;
        return true;
    }

    public function isUsernameFree($username)
    {
        $userRepo = $this->em->getRepository(User::class);
        if($nameFound = $userRepo->findOneBy(["username" => $username]))
            return false;
        return true;
    }
}