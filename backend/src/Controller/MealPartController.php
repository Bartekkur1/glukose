<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Meal;
use App\Entity\User;
use App\Responses\Responses;
use App\Entity\MealPart;
use Symfony\Component\HttpFoundation\Request;

class MealPartController extends AbstractController implements TokenAuthenticatedController
{

    private $entityManager;

    function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/mealpart/{id}", name="find_mealPart", methods={"GET"})
     */
    public function index($id)
    {
        if(!$id)
            return Responses::BadRequest(["error" => "Nie podano id"]);
        $entityManager = $this->getDoctrine()->getManager();
        $meals = $entityManager->getRepository(Meal::class);
        $mealparts = $entityManager->getRepository(MealPart::class);
        $meal = $meals->findOneBy(["id" => $id]);
        $mps = $mealparts->findBy(["meal" => $meal]);
        return new JsonResponse($mps);
    }

    /**
     * @Route("/mealpart", name="update_mealPart", methods={"PATCH"})
     */
    public function update(Request $request) 
    {
        $user = new User();
        $user->unserialize($request->request->get("user"));
        $data = json_decode($request->getContent(), true);
        $entityManager = $this->getDoctrine()->getManager();
        $mealparts = $entityManager->getRepository(MealPart::class);

        if(!isset($data["id"]))
            return Responses::BadRequest("Nie podano id");
        if(!$meal = $mealparts->findOneBy(["id" => $data["id"]]))
            return Responses::BadRequest("Rekord nie istnieje");

        $owner = $meal->getMeal();
        if($owner->getUser()->getId() != $user->getId())
            return Responses::PermisionDenied();

        !empty($data["name"]) ? $meal->setName($data["name"]) : "";
        !empty($data["kcal"]) ? $meal->setKcal($data["kcal"]) : "";
        !empty($data["weight"]) ? $meal->setWeight($data["weight"]) : "";
        $entityManager->persist($meal);
        $entityManager->flush();
        return Responses::Ok();
    }
}
