<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\UserInfo;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;

class UserInfoController extends AbstractController
{
    private $entityManager;
    private $userInfoRepo;

    function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
        $this->userInfoRepo = $entityManager->getRepository(UserInfo::class);
    }

    /**
     * @Route("/userinfo", name="update_userinfo", methods={"POST"})
     */
    public function update(Request $request) 
    {
        $user = $this->getUser();
        $input = json_decode($request->getContent(), true);
        $userInfo = $this->userInfoRepo->findOneBy(["user" => $user->getId()]);
        if(!$userInfo) {
            $userInfo = new UserInfo();
            $userInfo->setUser($user);
        }
        $userInfo->updateFromInput($input);
        $this->entityManager->merge($userInfo);
        $this->entityManager->flush();
        return new Response();
    }

    /**
     * @Route("/userinfo", name="get_userinfo", methods={"GET"})
     */
    public function find(Request $request)
    {
        $user = $this->getUser();
        $userInfo = $this->userInfoRepo->findOneBy(["user" => $user->getId()]);
        return new JsonResponse($userInfo, 200);
    }
}
