<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Controller\TokenAuthenticatedController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Dose;
use App\Entity\User;
use App\Responses\Responses;
use Symfony\Component\HttpFoundation\Request;

class DoseController extends AbstractController implements TokenAuthenticatedController
{
    function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/dose", name="add_dose", methods={"POST"})
     */
    public function new(Request $request, ValidatorInterface $validator)
    {
        $user = new User();
        $dose = new Dose();
        $user->unserialize($request->request->get("user"));
        $data = json_decode($request->getContent(), true);
        $dose->setUser($user);
        if(!empty($data["amount"]))
            isset($data["amount"]) ? $dose->setAmount($data["amount"]) : "";
        isset($data["type"]) ? $dose->setType($data["type"]) : "";
        isset($data["date"]) ? $dose->setDate(new \DateTime($data["date"])) : "";
        $errors = $validator->validate($dose);
        if(count($errors) > 0)
            return Responses::BadRequest(["error" => $errors[0]->getMessage(), "name" => $errors[0]->getPropertyPath()]);  

        $entityManager = $this->getDoctrine()->getManager();
        $doses = $entityManager->getRepository(dose::class);
        // dziwne
        $entityManager->merge($dose);
        $entityManager->flush();
        return Responses::Ok();
    }
    
    /**
     * @Route("/dose", name="update_dose", methods={"PATCH"})
     */
    public function update(Request $request)
    {
        $user = new User();
        $user->unserialize($request->request->get("user"));
        $data = json_decode($request->getContent(), true);
        $entityManager = $this->getDoctrine()->getManager();
        $doses = $entityManager->getRepository(Dose::class);
        if(!isset($data["id"]))
            return Responses::BadRequest("Nie podano id");

        if(!$dose = $doses->findOneBy(["id" => $data["id"]]))
            return Responses::BadRequest("Rekord nie istnieje");

        if($dose->getUser()->getId() != $user->getId())
            return Responses::PermisionDenied();

        $dose->setAmount($data["amount"]);
        $dose->setType($data["type"]);
        $entityManager->persist($dose);
        $entityManager->flush();
        return Responses::Ok();
    }
}
