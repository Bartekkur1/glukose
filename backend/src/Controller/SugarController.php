<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Controller\TokenAuthenticatedController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Sugar;
use App\Entity\User;
use App\Responses\Responses;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class SugarController extends AbstractController implements TokenAuthenticatedController
{

    private $entityManager;

    function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/sugar", name="add_sugar", methods={"POST"})
     */
    public function new(Request $request, ValidatorInterface $validator)
    {
        $user = new User();
        $sugar = new Sugar();
        $user->unserialize($request->request->get("user"));
        $data = json_decode($request->getContent(), true);
        $sugar->setUser($user);
        if(!empty($data["amount"]))
            isset($data["amount"]) ? $sugar->setAmount($data["amount"]) : "";
        $date = new \DateTime($data["date"]);
        $date->setTimezone(new \DateTimeZone("Europe/Warsaw"));
        isset($data["date"]) ? $sugar->setDate($date) : "";
        $errors = $validator->validate($sugar);
        if(count($errors) > 0)
            return Responses::BadRequest(["error" => $errors[0]->getMessage(), "name" => $errors[0]->getPropertyPath()]);  

        $entityManager = $this->getDoctrine()->getManager();
        $sugars = $entityManager->getRepository(Sugar::class);
        $entityManager->merge($sugar);
        $entityManager->flush();
        return Responses::Ok();
    }
    
    /**
     * @Route("/sugar", name="update_sugar", methods={"PATCH"})
     */
    public function update(Request $request)
    {
        $user = new User();
        $user->unserialize($request->request->get("user"));
        $data = json_decode($request->getContent(), true);
        $entityManager = $this->getDoctrine()->getManager();
        $sugars = $entityManager->getRepository(Sugar::class);

        if(!isset($data["id"]))
            return Responses::BadRequest("Nie podano id");

        if(!$sugar = $sugars->findOneBy(["id" => $data["id"]]))
            return Responses::BadRequest("Rekord nie istnieje");

        if($sugar->getUser()->getId() != $user->getId())
            return Responses::PermisionDenied();

        $sugar->setAmount($data["amount"]);
        $entityManager->persist($sugar);
        $entityManager->flush();
        return Responses::Ok();
    }
}
