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
use App\Entity\MealPart;
use App\Responses\Responses;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

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
        $entityManager = $this->getDoctrine()->getManager();
        $users = $entityManager->getRepository(User::class);
        $user->unserialize($request->request->get("user"));
        $owner = $users->findOneBy(["id" => $user->getId()]);
        $data = json_decode($request->getContent(), true);
        $meal->setUser($owner);
        isset($data["kcal"]) ? $meal->setKcal($data["kcal"]) : "";
        isset($data["fats"]) ? $meal->setFats($data["fats"]) : "";
        isset($data["carbohydrates"]) ? $meal->setCarbohydrates($data["carbohydrates"]) : "";
        $date = new \DateTime($data["date"]);
        $date->setTimezone(new \DateTimeZone("Europe/Warsaw"));
        isset($data["date"]) ? $meal->setDate($date) : "";
        $errors = $validator->validate($meal);
        if(count($errors) > 0)
            return Responses::BadRequest($errors[0]->getMessage());

        $entityManager->persist($meal);
        $entityManager->flush();

        if(isset($data["meal"]))
        {
            foreach($data["meal"] as $part) {
                $mealPart = new MealPart();
                $mealPart->setKcal($part["kcal"]);
                $mealPart->setName($part["name"]);
                $mealPart->setWeight($part["weight"]);
                $mealPart->setMeal($meal);
                $entityManager->merge($mealPart);
            }
            $entityManager->flush();
        }
        return new Response("", 200);
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
    
        $date = new \DateTime($data["date"]);
        $date->setTimezone(new \DateTimeZone("Europe/Warsaw"));
        !empty($data["kcal"]) ? $meal->setKcal($data["kcal"]) : "";
        !empty($data["date"]) ? $meal->setDate($date) : "";
        !empty($data["fats"]) ? $meal->setFats($data["fats"]) : "";
        !empty($data["carbohydrates"]) ? $meal->setCarbohydrates($data["carbohydrates"]) : "";
        $entityManager->persist($meal);
        $entityManager->flush();
        return Responses::Ok();
    }
}
