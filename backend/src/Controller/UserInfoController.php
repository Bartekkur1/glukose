<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Controller\TokenAuthenticatedController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\UserInfo;
use App\Entity\User;
use App\Responses\Responses;
use Symfony\Component\HttpFoundation\Request;

class UserInfoController extends AbstractController implements TokenAuthenticatedController
{
    private $entityManager;

    function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/userinfo", name="update_userinfo", methods={"POST"})
     */
    public function update(Request $request) 
    {
        $user = new User();
        $user->unserialize($request->request->get("user"));
        $entityManager = $this->getDoctrine()->getManager();
        $userInfos = $entityManager->getRepository(UserInfo::class);
        $data = json_decode($request->getContent(), true);
        $userInfo = $userInfos->findOneBy(["user" => $user->getId()]);
        if(!$userInfo) {
            $userInfo = new UserInfo();
            $user->setToken($request->headers->get("Authorization"));
        }
        !empty($data["age"]) ? $userInfo->setAge($data["age"]) : $userInfo->setAge(0);
        !empty($data["gender"]) ? $userInfo->setGender($data["gender"]) : $userInfo->setGender("");
        !empty($data["height"]) ? $userInfo->setHeight($data["height"]) : $userInfo->setHeight(0);
        !empty($data["weight"]) ? $userInfo->setWeight($data["weight"]) : $userInfo->setWeight(0);
        !empty($data["insulinType"]) ? $userInfo->setInsulinType($data["insulinType"]) : $userInfo->setInsulinType("");
        !empty($data["dailyInsulinType"]) ? $userInfo->setDailyInsulinType($data["dailyInsulinType"]) : $userInfo->setDailyInsulinType("");
        !empty($data["dailyInsulinAmount"]) ? $userInfo->setDailyInsulinAmount($data["dailyInsulinAmount"]) : $userInfo->setDailyInsulinAmount(0);
        $entityManager->merge($userInfo);
        $entityManager->flush();
        return Responses::Ok();
    }

    /**
     * @Route("/userinfo", name="get_userinfo", methods={"GET"})
     */
    public function find(Request $request)
    {
        $user = new User();
        $user->unserialize($request->request->get("user"));
        $entityManager = $this->getDoctrine()->getManager();
        $userInfos = $entityManager->getRepository(UserInfo::class);
        $userInfo = $userInfos->findOneBy(["user" => $user->getId()]);
        return new JsonResponse($userInfo, 200);
    }
}
