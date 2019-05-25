<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use App\Service\RecordService;

class RecordController extends AbstractController
{
    private $recordService;

    function __construct(RecordService $recordService)
    {
        $this->recordService = $recordService;
    }

    /**
     * @Route("/new_record/{type}", name="new_record")
     */
    public function new(Request $request, $type)
    {
        $data = json_decode($request->getContent(), true);
        try
        {
            return new JsonResponse(["id" => $this->recordService->new($this->getUser(), $type, $data)]);
        }
        catch(BadRequestHttpException $e)
        {
            return new JsonResponse(["error" => $e->getMessage()], 400);
        }
    }

    /**
     * @Route("/update_record/{type}", name="update_record")
     */
    public function update(Request $request, $type)
    {
        $data = json_decode($request->getContent(), true);
        try
        {
            $this->recordService->update($this->getUser(), $type, $data);
            return new Response();
        }
        catch(BadRequestHttpException $e)
        {
            return new JsonResponse(["error" => $e->getMessage()], 400);
        }
    }

    /**
     * @Route("/delete_record/{type}/{id}", name="delete_record")
     */
    public function delete(Request $request, $type, $id)
    {
        try
        {
            $this->recordService->delete($this->getUser(), $type, $id);
            return new Response();
        }
        catch(BadRequestHttpException $e)
        {
            return new JsonResponse(["error" => $e->getMessage()], 400);
        }
    }


    /**
     * @Route("/find_record/{type}/{date}/{range}", name="find_record")
     */
    public function find(Request $request, $type, $date = null, $range = null)
    {
        try {
            return new JsonResponse(
                $this->recordService->search($this->getUser(), $type, $date, $range), 
                Response::HTTP_OK
            );
        } 
        catch(BadRequestHttpException $e)
        {
            return new JsonResponse(["error" => $e->getMessage()], 400);
        }
    }
}
