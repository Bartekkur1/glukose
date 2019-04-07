<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Controller\TokenAuthenticatedController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Meal;
use App\Entity\User;
use App\Responses\Responses;
use Symfony\Component\HttpFoundation\Request;

class MealController extends AbstractController implements TokenAuthenticatedController
{
    private $entityManager;

    function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/meal", name="add_meal", methods={"POST"})
     */
    public function new(Request $request, ValidatorInterface $validator)
    {
        $user = new User();
        $meal = new Meal();
        $user->unserialize($request->request->get("user"));
        $data = json_decode($request->getContent(), true);
        $meal->setUser($user);
        isset($data["kcal"]) ? $meal->setKcal($data["kcal"]) : "";
        isset($data["fats"]) ? $meal->setFats($data["fats"]) : "";
        isset($data["carbohydrates"]) ? $meal->setCarbohydrates($data["carbohydrates"]) : "";
        isset($data["date"]) ? $meal->setDate(new \DateTime($data["date"])) : "";
        $errors = $validator->validate($meal);
        if(count($errors) > 0)
            return Responses::BadRequest($errors[0]->getMessage());

        $entityManager = $this->getDoctrine()->getManager();
        $meals = $entityManager->getRepository(Meal::class);
        // dziwne
        $entityManager->merge($meal);
        $entityManager->flush();
        return Responses::Ok();
    }
    
    /**
     * @Route("/meal", name="update_meal", methods={"PATCH"})
     */
    public function update(Request $request)
    {
        $user = new User();
        $user->unserialize($request->request->get("user"));
        $data = json_decode($request->getContent(), true);
        $entityManager = $this->getDoctrine()->getManager();
        $meals = $entityManager->getRepository(Meal::class);
        if(!isset($data["id"]))
            return Responses::BadRequest("Nie podano id");
        if(!$meal = $meals->findOneBy(["id" => $data["id"]]))
            return Responses::BadRequest("Rekord nie istnieje");

        if($meal->getUser()->getId() != $user->getId())
            return Responses::PermisionDenied();
    
        !empty($data["kcal"]) ? $meal->setKcal($data["kcal"]) : "";
        !empty($data["fats"]) ? $meal->setFats($data["fats"]) : "";
        !empty($data["carbohydrates"]) ? $meal->setCarbohydrates($data["carbohydrates"]) : "";
        $entityManager->persist($meal);
        $entityManager->flush();
        return Responses::Ok();
    }
}
