<?php

namespace App\Service;

use App\Entity\User;
use App\Responses\Responses;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserService
{
    private $em;
    private $encoder;
    private $validator;
    private $userRepo;

    public function __construct(EntityManagerInterface $em, ValidatorInterface $validator, UserPasswordEncoderInterface $encoder)
    {
        $this->em = $em;
        $this->encoder = $encoder;
        $this->validator = $validator;
        $this->userRepo = $this->em->getRepository(User::class);
    }

    public function createUser($data)
    {
        $data = json_decode($data, true);
        if($data["password"] != $data["confirmPassword"])
            throw new BadRequestHttpException("Hasła muszą być identyczne");
        
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

    public function updateUser($user, $input)
    {
        if(isset($input["password"]) && isset($input["confirmPassword"]))
            if($input["password"] == $input["confirmPassword"])
                if(strlen($input["password"]) >= 6)
                    $user->setPassword($this->encoder->encodePassword($user, $input["password"]));
                else
                    throw new BadRequestHttpException("Hasło musi mieć przynajmniej 6 znaków");
            else
                throw new BadRequestHttpException("Hasła muszą być identyczne");

        if(isset($input["email"]))
            if($this->isUserEmailFree($input["email"]))
                $user->setEmail($input["email"]);
            else
                throw new BadRequestHttpException("Adres email jest już zajęty");

        $errors = $this->validateUser($user);
        if(count($errors) > 0)
            throw new BadRequestHttpException($errors[0]->getMessage());

        $this->em->persist($user);
        $this->em->flush();
    }

    public function getUserFromSerialized($serialized)
    {
        $unserialized = new User();
        $unserialized->unserialize($serialized);
        if(!$user = $this->userRepo->findOneBy(["username" => $unserialized->getUsername()]))
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
        if($emailFound = $this->userRepo->findOneBy(["email" => $email]))
            return false;
        return true;
    }

    public function isUsernameFree($username)
    {
        if($nameFound = $this->userRepo->findOneBy(["username" => $username]))
            return false;
        return true;
    }
}